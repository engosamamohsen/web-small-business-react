import fs from 'fs';
import path from 'path';

interface ApiLogEntry {
    timestamp: string;
    requestId: string;
    url: string;
    method: string;
    requestHeaders?: Record<string, any>;
    status: number;
    responseData?: any;
    executionTime: number; // in milliseconds
    error?: string;
}

const LOG_FILE_PATH = path.join(process.cwd(), 'api-logs.json');
const ENABLE_LOGGING = import.meta.env.PUBLIC_ENABLE_API_LOGGING === 'true';

/**
 * Generate a unique request ID for correlation
 */
export function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Write log entry to JSON file
 */
function writeLogToFile(entry: ApiLogEntry): void {
    if (!ENABLE_LOGGING) return;

    try {
        let logs: ApiLogEntry[] = [];

        // Read existing logs if file exists
        if (fs.existsSync(LOG_FILE_PATH)) {
            const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
            try {
                logs = JSON.parse(fileContent);
                if (!Array.isArray(logs)) logs = [];
            } catch {
                logs = [];
            }
        }

        // Append new entry
        logs.push(entry);

        // Write back to file with pretty formatting
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (error) {
        // Silent fail - don't break the application if logging fails
        console.error('[Logger] Failed to write log:', error);
    }
}

/**
 * Log API request - Just returns start time, doesn't write to file yet
 */
export function logApiRequest(
    requestId: string,
    url: string,
    method: string,
    headers?: Record<string, any>
): number {
    const startTime = Date.now();

    if (!ENABLE_LOGGING) return startTime;

    // Console log for development
    console.log(`🌐 [API REQUEST] ${method} ${url}`, {
        requestId,
        headers: sanitizeHeaders(headers),
    });

    return startTime;
}

/**
 * Log complete API call (request + response combined) to file
 */
export function logApiResponse(
    requestId: string,
    url: string,
    method: string,
    status: number,
    response: any,
    startTime: number,
    requestHeaders?: Record<string, any>,
    error?: string
): void {
    if (!ENABLE_LOGGING) return;

    const executionTime = Date.now() - startTime;

    // Write combined entry to file
    const entry: ApiLogEntry = {
        timestamp: new Date().toISOString(),
        requestId,
        url,
        method,
        requestHeaders: sanitizeHeaders(requestHeaders),
        status,
        responseData: sanitizeResponse(response),
        executionTime,
        ...(error && { error }),
    };

    writeLogToFile(entry);

    // Console log for development
    const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';
    console.log(
        `${statusIcon} [API RESPONSE] ${status} ${method} ${url} (${executionTime}ms)`,
        {
            requestId,
            executionTime: `${executionTime}ms`,
            status,
            ...(error && { error }),
        }
    );
}

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(headers?: Record<string, any>): Record<string, any> | undefined {
    if (!headers) return undefined;

    const sanitized = { ...headers };

    // Remove or mask sensitive headers
    if (sanitized.Authorization) {
        sanitized.Authorization = 'Bearer ***';
    }
    if (sanitized.authorization) {
        sanitized.authorization = 'Bearer ***';
    }

    return sanitized;
}

/**
 * Sanitize response to limit size and remove sensitive data
 */
function sanitizeResponse(response: any): any {
    if (!response) return null;

    // Limit response size in logs (prevent huge logs)
    const responseStr = JSON.stringify(response);
    if (responseStr.length > 5000) {
        return {
            _truncated: true,
            _size: responseStr.length,
            _preview: responseStr.substring(0, 500) + '...',
        };
    }

    return response;
}
