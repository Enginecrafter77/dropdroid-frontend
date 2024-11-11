export type User = {
    id: number,
    username: string,
    display_name: string,
    role: string,
    avatar_url: string
};

export type Organization = {
    id: number,
    slug: string,
    name: string,
    description: string|undefined,
    icon_url: string
};

export type OrganizationMembership = {
    id: number,
    user: User,
    organization: Organization,
    role: string
};

export type PaginationResponse<T> = {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number,
    first_page_url: string,
    last_page_url: string,
    next_page_url: string|null,
    prev_page_url: string|null,
    path: string,
    from: number,
    to: number,
    data: T[]
};

export type Application = {
    id: number,
    name: string,
    namespace: string,
    description: string|null,
    icon_url: string,
    organization: Organization
};
