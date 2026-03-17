/**
 * Shared types and API functions for case messaging (client side).
 * Used by /c/status and /c/portal pages.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.sudomanaged.com";
const MESSAGES_URL = `${API_BASE}/api/rosen/public/client/messages`;
const SEND_URL = `${API_BASE}/api/rosen/public/client/message`;

export interface CaseMessage {
  id: string;
  case_id?: string;
  sender_role: "client" | "staff" | "system";
  sender_display_name?: string | null;
  message: string;
  category?: string | null;
  created_at: string;
  read_by_client_at?: string | null;
  read_by_ops_at?: string | null;
}

export interface ThreadResponse {
  success: boolean;
  messages: CaseMessage[];
  unread_count: number;
  case_id: string;
}

export async function fetchClientThread(
  token: string,
  caseId: string,
  since?: string
): Promise<ThreadResponse> {
  const params = new URLSearchParams({ case_id: caseId });
  if (since) params.append("since", since);

  const res = await fetch(`${MESSAGES_URL}?${params}`, {
    headers: { "x-intake-token": token },
  });

  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  return res.json();
}

export async function sendClientMessage(
  token: string,
  caseId: string,
  body: string,
  category?: string
): Promise<{ success: boolean }> {
  const payload: Record<string, string> = { case_id: caseId, message: body };
  if (category) payload.category = category;

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-intake-token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
  return res.json();
}
