export enum ServerRole {
    USER = "user",
    ADMIN = "admin"
};

export enum OrganizationRole {
    MEMBER = "member",
    ADMIN = "admin"
};

export class User {
    id: number = 0;
    username: string = "new_user";
    display_name: string = "New User";
    role: ServerRole = ServerRole.USER;
    avatar_url: string = "https://null.null/null.png";
};

export class Organization {
    id: number = 0;
    slug: string = "new_organization";
    name: string = "New Organization";
    description: string|undefined = "An example application";
    icon_url: string = "https://null.null/null.png";
};

export class Application {
    id: number = 0;
    name: string = "New Application";
    namespace: string = "com.example.new_app";
    description: string|null = "Here goes description";
    icon_url: string = "https://null.null/null.png";
    organization: Organization|undefined = undefined;
};

export class Package {
    id: number = 0;
    label: string|null = null;
    version_name: string = "1.0.0";
    version_code: number = 100;
    downloads: number = 0;
    created_at: number = 0;
    flavor: string = "main";
    variant: string = "release";
    file_url: string = "https://null.null/null.apk";
    application: Application|undefined = undefined;
};

export class OrganizationMembership {
    id: number = 0;
    role: OrganizationRole = OrganizationRole.MEMBER;
    user: User|undefined = undefined;
    organization: Organization|undefined = undefined;
};

export class PaginationResponse<T> {
    total: number = 0;
    per_page: number = 0;
    current_page: number = 0;
    last_page: number = 0;
    first_page_url: string = "";
    last_page_url: string = "";
    next_page_url: string|null = null;
    prev_page_url: string|null = null;
    path: string = "";
    from: number = 0;
    to: number = 0;
    data: T[] = []
};
