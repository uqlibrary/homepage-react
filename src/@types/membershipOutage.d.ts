export interface MembershipOutageWindow {
    from: string;
    to: string;
}

export interface MembershipOutageOverride {
    MAINTENANCE_WINDOW?: MembershipOutageWindow;
    PAYMENT_GATEWAY_OUTAGE?: MembershipOutageWindow;
}

declare global {
    interface Window {
        __MEMBERSHIP_OUTAGE_OVERRIDE__?: MembershipOutageOverride;
    }
}
