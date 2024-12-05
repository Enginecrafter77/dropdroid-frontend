export interface SelectItem {
    value: string;
    title: string;
};

export function createSelectMapping<T>(items: T[], mapper: (item: T) => string|undefined): SelectItem[] {
    return items.map((i) => {
        let mapped = mapper(i);
        if(mapped === undefined)
            return undefined;
        return {
            value: i as string,
            title: mapped
        };
    }).filter((i) => i !== undefined);
};

export function createEnumSelectMapping(enumclass: {[k: string]: string}, mapper: (item: string) => string|undefined) {
    return createSelectMapping(Object.values<string>(enumclass), mapper);
};
