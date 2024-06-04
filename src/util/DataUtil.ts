import { TreeDataNode } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { AUTH_PLATFORM, AUTH_PLATFORM_KR } from "../constants/common/DataConstants";
import { MenuInterface } from "../types/entity/menu/MenuInterface";

/**
 * 대상 배열의 각 객체에 'key' 값을 추가한다.
 * @param {any[]} obj 'key'값을 추가할 대상 object[]
 * @returns 'key'값이 추가된 object[]
 */
export const addKey = (obj: any[]): object[] => {
    obj.forEach((e) => e.key = e.id)
    return obj;
}

/**
 * 배열을 { label, value } 형태로 변환한다
 * @param {string} labelField label에 들어갈 필드명
 * @param {string} valueField value에 들어갈 필드명
 * @param {any[]} obj 변환 대상 배열
 * @returns {{ label: string, value: string }[]} 변환된 배열
 */
export const toOption = (labelField: string, valueField: string, obj: any[]): { label: string, value: string }[] => {
    const result: { label: string, value: string }[] = [];
    obj.forEach(e => result.push({ label: e[labelField], value: e[valueField] }))

    return result;
}

/**
 * 플랫폼명을 한국어로 변환한다
 * @param {string} platform 플랫폼명 영문
 * @returns 변환된 한국어 플랫폼
 */
export const translatePlatform = (platform: string): string => {
    return platform === AUTH_PLATFORM.KAKAO ? AUTH_PLATFORM_KR.KAKAO : (platform === AUTH_PLATFORM.NAVER ? AUTH_PLATFORM_KR.NAVER : "");
}

/**
 * MenuInterface 배열을 DefaultOptionType 배열로 변환한다
 * @param menus {MenuInterface[]} 수정 대상 메뉴 배열
 * @returns 변환된 DefaultOptionType 배열
 */
export const getOptionMenus = (menus: MenuInterface[], targetMenu: MenuInterface): DefaultOptionType[] => {
    const result: DefaultOptionType[] = [];

    menus.forEach((each) => {
        if (each.id !== targetMenu.id) {
            const node: DefaultOptionType = {
                label: each.title,
                value: each.id,
                children: []
            };

            if (each.children) {
                node.children = getOptionMenus(each.children, targetMenu);
            }

            result.push(node);
        }
    });
    
    return result;
}

/**
 * MenuInterface 배열을 TreeDataNode 배열로 변환한다
 * @param menus {MenuInterface[]} 수정 대상 메뉴 배열
 * @returns 변환된 TreeDataNode 배열
 */
export const getTreeNodeMenus = (menus: MenuInterface[]): TreeDataNode[] => {
    const result: TreeDataNode[] = [];

    menus.forEach((each) => {
        const node: TreeDataNode = {
            title: each.title,
            key: each.id,
            children: []
        };

        if (each.children) {
            node.children = getTreeNodeMenus(each.children);
        }

        result.push(node);
    });
    
    return result;
}