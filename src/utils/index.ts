import { OrganizationRole } from "@/types";

export function shuffleUrl(url: string): string {
    const parts = url.split("?");
    const rng = Math.floor(Math.random() * 65535);
    return `${parts[0]}?${rng}`;
}

export function mapByProperty<T, K extends string|number>(array: Iterable<T>, mapper: (item: T) => K|undefined): Map<K, T> {
    let map = new Map<K,T>();
    for(const item of array)
    {
        const key = mapper(item);
        if(key === undefined)
            continue;
        map.set(key, item);
    }
    return map;
};

export function getRoleLabel(role: OrganizationRole|string|undefined): string|undefined {
    switch(role)
    {
        case OrganizationRole.ADMIN:
            return "Administrator";
        case OrganizationRole.MEMBER:
            return "Member";
        default:
            return undefined;
    }
};

export function downloadFile(url: string, name: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
}
