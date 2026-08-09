import { NextRequest, NextResponse } from 'next/server';
import { getAllKeyStatus, refreshAllKeyStatus, isCacheStale } from '@/lib/openrouter-key-manager';

export const dynamic = 'force-dynamic';

/**
 * Check OpenRouter API credits for all configured keys
 * This endpoint is intentionally sanitized to not expose API keys
 * Cache refreshes automatically every 4 hours
 */
export async function GET(request: NextRequest) {
  try {
    // Get Cloudflare Workers environment bindings
    const cfRequest = request as { env?: Record<string, string | undefined> };
    const env = cfRequest.env;

    // Check if JSON format or manual refresh is requested
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Get current status from cache
    let keyStatus = getAllKeyStatus();

    // Check if manual refresh, cache is empty (cold start), or stale (older than 4 hours)
    if (forceRefresh || Object.keys(keyStatus).length === 0 || isCacheStale()) {
      const reason = forceRefresh ? 'manual refresh requested' :
                     Object.keys(keyStatus).length === 0 ? 'empty' : 'stale (>4 hours)';
      console.log(`[Credits] Cache ${reason}, refreshing all key statuses...`);
      await refreshAllKeyStatus(env);
      keyStatus = getAllKeyStatus();
    } else {
      console.log('[Credits] Using cached key status (fresh)');
    }

    // Sanitize response to remove sensitive data
    const sanitizedStatus = Object.entries(keyStatus).map(([name, status]) => ({
      name,
      isAvailable: status.isAvailable,
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      lastChecked: new Date(status.lastChecked).toISOString(),
      lastCheckedRelative: getRelativeTime(status.lastChecked),
      error: status.error,
      // Never include the actual key
    }));

    const totalKeys = sanitizedStatus.length;
    const availableKeys = sanitizedStatus.filter(k => k.isAvailable).length;
    const totalCredits = sanitizedStatus.reduce((sum, k) => sum + (k.credits || 0), 0);
    const totalRateLimitRemaining = sanitizedStatus.reduce((sum, k) => sum + (k.rateLimitRemaining || 0), 0);
    const overallHealth = availableKeys === totalKeys ? 'operational' : availableKeys > 0 ? 'degraded' : 'outage';

    // Return JSON if format=json
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        keys: sanitizedStatus,
        totalKeys,
        availableKeys,
        totalCredits,
        totalRateLimitRemaining,
        overallHealth,
        timestamp: new Date().toISOString(),
        note: 'API keys are not exposed for security'
      });
    }

    // Return HTML status page
    const html = generateStatusPageHTML(sanitizedStatus, {
      totalKeys,
      availableKeys,
      totalCredits,
      totalRateLimitRemaining,
      overallHealth,
      timestamp: new Date().toISOString()
    });

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: unknown) {
    console.error('Credits check error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      error: 'Failed to check API credits',
      details: errorMessage
    }, { status: 500 });
  }
}

/**
 * Get relative time string (e.g., "2 minutes ago")
 */
function getRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

interface KeyStatusDisplay {
  name: string;
  isAvailable: boolean;
  credits?: number;
  rateLimitRemaining?: number;
  lastCheckedRelative: string;
  error?: string;
}

interface StatsDisplay {
  totalKeys: number;
  availableKeys: number;
  totalCredits: number;
  totalRateLimitRemaining: number;
  overallHealth: string;
  timestamp: string;
}

/**
 * Generate HTML status page
 */
function generateStatusPageHTML(keys: KeyStatusDisplay[], stats: StatsDisplay): string {
  const statusColor = stats.overallHealth === 'operational' ? '#10b981' :
                      stats.overallHealth === 'degraded' ? '#f59e0b' : '#ef4444';
  const statusIcon = stats.overallHealth === 'operational' ? '✓' :
                     stats.overallHealth === 'degraded' ? '⚠' : '✗';
  const statusText = stats.overallHealth === 'operational' ? 'All Systems Operational' :
                     stats.overallHealth === 'degraded' ? 'Partial Service Degradation' : 'Service Outage';

  const keyRows = keys.map(key => {
    const statusBadge = key.isAvailable
      ? '<span class="badge badge-success">✓ Active</span>'
      : '<span class="badge badge-error">✗ Unavailable</span>';

    const creditsDisplay = key.credits !== undefined
      ? `$${key.credits.toFixed(2)}`
      : 'N/A';

    const rateLimitDisplay = key.rateLimitRemaining !== undefined
      ? key.rateLimitRemaining
      : 'N/A';

    const errorDisplay = key.error
      ? `<div class="error-msg">${key.error}</div>`
      : '';

    return `
      <tr>
        <td><strong>${key.name}</strong></td>
        <td>${statusBadge}</td>
        <td>${creditsDisplay}</td>
        <td>${rateLimitDisplay}</td>
        <td>${key.lastCheckedRelative}</td>
        <td class="error-cell">${errorDisplay || '-'}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="googlebot" content="noindex, nofollow">
  <meta name="bingbot" content="noindex, nofollow">
  <title>PrivacyAnalyzer - API Service Status</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      color: #1f2937;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .header p {
      opacity: 0.9;
      font-size: 1rem;
    }

    .header-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }

    .refresh-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .refresh-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
      transform: translateY(-2px);
    }

    .refresh-btn:active {
      transform: translateY(0);
    }

    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .refresh-icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .refresh-btn.refreshing .refresh-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .status-banner {
      background: ${statusColor};
      color: white;
      padding: 1.5rem 2rem;
      text-align: center;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .status-icon {
      font-size: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      background: #f9fafb;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .content {
      padding: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background: #f9fafb;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-error {
      background: #fee2e2;
      color: #991b1b;
    }

    .error-msg {
      color: #dc2626;
      font-size: 0.875rem;
      background: #fef2f2;
      padding: 0.5rem;
      border-radius: 6px;
      border-left: 3px solid #dc2626;
    }

    .error-cell {
      max-width: 300px;
    }

    .footer {
      padding: 1.5rem 2rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    .refresh-info {
      margin-top: 1rem;
      padding: 1rem;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      font-size: 0.875rem;
      color: #1e40af;
    }

    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .header h1 {
        font-size: 1.5rem;
      }

      table {
        font-size: 0.875rem;
      }

      th, td {
        padding: 0.75rem 0.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 PrivacyAnalyzer API Status</h1>
      <p>OpenRouter API Key Health & Usage Monitor</p>
      <div class="header-actions">
        <button class="refresh-btn" onclick="refreshStatus()">
          <span class="refresh-icon">🔄</span>
          <span class="refresh-text">Refresh Status</span>
        </button>
      </div>
    </div>

    <div class="status-banner">
      <span class="status-icon">${statusIcon}</span>
      <span>${statusText}</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.availableKeys}/${stats.totalKeys}</div>
        <div class="stat-label">Active Keys</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">$${stats.totalCredits.toFixed(2)}</div>
        <div class="stat-label">Total Credits</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">${stats.totalRateLimitRemaining}</div>
        <div class="stat-label">Rate Limit Available</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">${stats.overallHealth === 'operational' ? '100%' : Math.round((stats.availableKeys / stats.totalKeys) * 100) + '%'}</div>
        <div class="stat-label">System Health</div>
      </div>
    </div>

    <div class="content">
      <h2 class="section-title">API Key Details</h2>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Key Name</th>
              <th>Status</th>
              <th>Credits</th>
              <th>Rate Limit Remaining</th>
              <th>Last Checked</th>
              <th>Error Details</th>
            </tr>
          </thead>
          <tbody>
            ${keyRows}
          </tbody>
        </table>
      </div>

      <div class="refresh-info">
        <strong>ℹ️ Refresh Information:</strong> API key status is cached for 4 hours and automatically refreshed when accessed.
        Manual refresh available via button above. Keys rotate daily to balance load. Fallback to alternate keys occurs instantly on failures.
      </div>
    </div>

    <div class="footer">
      <p><strong>Last Updated:</strong> ${new Date(stats.timestamp).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
      })}</p>
      <p style="margin-top: 0.5rem;">
        <a href="/api/credits?format=json" target="_blank">View JSON Format</a> |
        <a href="https://privacyanalyzer.in" target="_blank">Back to PrivacyAnalyzer</a>
      </p>
      <p style="margin-top: 1rem; font-size: 0.75rem;">
        🔐 API keys are never exposed for security. Environment variable names used for identification.
      </p>
    </div>
  </div>

  <script>
    function refreshStatus() {
      const button = document.querySelector('.refresh-btn');
      const refreshText = document.querySelector('.refresh-text');

      // Disable button and show loading state
      button.disabled = true;
      button.classList.add('refreshing');
      refreshText.textContent = 'Refreshing...';

      // Redirect to same page with refresh parameter
      window.location.href = window.location.pathname + '?refresh=true';
    }
  </script>
</body>
</html>
  `;
}
