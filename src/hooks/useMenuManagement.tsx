import { Key, useEffect, useState } from "react";
import { MenuInterface } from "../types/entity/menu/MenuInterface";
import { TreeDataNode, message } from "antd";
import { DefaultOptionType } from "antd/es/select";

/**
 * 메뉴 관리에 사용되는 변수 및 메서드를 훅으로 제공
 * @returns 메뉴 관리에 사용되는 변수 및 메서드 모음
 */
function useMenuManagement() {
    const [allMenus, setAllMenus] = useState<MenuInterface[] | []>([]);
    const [targetMenu, setTargetMenu] = useState<MenuInterface | null>(null);
    const [optionMenus, setOptionMenus] = useState<DefaultOptionType[]>([])
    const [treeNodeMenus, setTreeNodeMenus] = useState<TreeDataNode[]>([])

    /**
     * tree의 selection-change 이벤트 후처리
     * @param selectedKeys tree가 반환한 selectedKeys
     */
    const handleSelectionChange = (selectedKeys: Key[]) => {
        setTargetMenu(selectedKeys.length ? searchMenu(allMenus, selectedKeys[0]) : null);
    }

    /**
     * 메뉴 목록에 신규 메뉴를 추가한다.
     */
    const handleInsertMenu = () => {
        for (let menu of allMenus) {
            if (!menu.id) {
                message.error('한번에 하나의 메뉴만 추가할 수 있습니다.');
                return;
            }
        }

        setAllMenus([...allMenus, getDummyMenu('새로 추가된 메뉴')]);
    }

    useEffect(() => {
        allMenus.length > 0 && setTreeNodeMenus(getTreeNodeMenus(allMenus));
    }, [allMenus])

    useEffect(() => {
        targetMenu && setOptionMenus(getOptionMenus(allMenus, targetMenu));
    }, [targetMenu])

    return { targetMenu, setTargetMenu, optionMenus, treeNodeMenus, allMenus, setAllMenus, handleSelectionChange, handleInsertMenu, isIdenticalMenus }
}

export default useMenuManagement;

/**
 * MenuInterface 배열을 DefaultOptionType 배열로 변환한다
 * @param menus {MenuInterface[]} 수정 대상 메뉴 배열
 * @returns 변환된 DefaultOptionType 배열
 */
const getOptionMenus = (menus: MenuInterface[], targetMenu: MenuInterface): DefaultOptionType[] => {
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
const getTreeNodeMenus = (menus: MenuInterface[]): TreeDataNode[] => {
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

/**
 * 트리형태의 메뉴 배열에서 대상 식별번호를 가진 메뉴를 검색한다.
 * @param menus {MenuInterface[]} 트리형태의 메뉴 배열
 * @param key {string} 검색 대상 메뉴 식별번호
 * @returns 검색 대상 메뉴 | null
 */
const searchMenu = (menus: MenuInterface[], key: Key): MenuInterface | null => {
    for (let each of menus) {
        if (each.id === key) {
            return each;
        } else if (each.children?.length) {
            const target = searchMenu(each.children, key);
            if (target) {
                return target;
            }
        }
    }
    
    return null;
}

/**
 * 텅빈 Menu의 Dummy 객체를 반환한다.
 * @returns 빈 Menu 객체
 */
const getDummyMenu = (title: string | undefined): MenuInterface => {
    return {
        id: '',
        title: title || '신규 메뉴',
        isUsed: true,
        createMemberId: 'test_id',
    }
}

/**
 * 두 비교대상 메뉴를 비교하여 일치여부를 리턴한다
 * @param {MenuInterface} first 비교대상 첫번째 메뉴
 * @param {MenuInterface} second 비교대상 두번째 메뉴
 * @returns 두 비교대상 메뉴의 일치 여부
 */
const isIdenticalMenus = (first: MenuInterface, second: MenuInterface) => {
    const keys = Object.keys(first);

    for (let key of keys) if (first[key] !== second[key]) return false

    return true
}