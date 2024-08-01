import dayjs, { Dayjs } from "dayjs"

/**
 * number[] 타입의 날짜 정보를 Date 객체로 변환
 * @param {number[]} ldt Server에서 LocalDateTime 타입으로 받은 length: 7의 객체
 * @returns {Date} Date 타입으로 변환된 날짜 객체
 */
export const toDate = (ldt: number[]): Date => {
    while (ldt.length < 7) ldt.push(0);
    return dayjs(`${ldt[0]}-${ldt[1]}-${ldt[2]}T${ldt[3]}:${ldt[4]}:${ldt[5]}:${ldt[6]}`).toDate()
}

/**
 * 현재 날짜를 dayjs로 변환하여 return
 * @param {number[]} ldt Server에서 LocalDateTime 타입으로 받은 length: 7의 객체
 * @returns {Dayjs} dayjs 변환된 현재 날짜 값
 */
export const toDayjsDate = (ldt: number[]): Dayjs => {
    while (ldt.length < 7) ldt.push(0);
    return dayjs(`${ldt[0]}-${ldt[1]}-${ldt[2]}T${ldt[3]}:${ldt[4]}:${ldt[5]}:${ldt[6]}`)
}

/**
 * 현재시간을 milliseconds로 리턴한다
 * @returns {number} 현재시간 milliseconds
 */
export const getTime = (): number => {
    return new Date().getTime();
}

/**
 * 현재 날짜를 dayjs로 변환하여 return
 * @returns {Dayjs} dayjs 변환된 현재 날짜 값
 */
export const getDayjsDate = (): Dayjs => {
    return dayjs(new Date());
}

/**
 * number[] 타입의 날짜를 'YYYY-MM-DD' 형태의 문자열로 변환
 * @param {number[]} date 변환 대상 날짜
 * @returns 'YYYY-MM-DD' 형태의 문자열
 */
export const toDateString = (date: number[]): string => {
    return `${String(date[0])}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`
}

/**
 * number[] 타입의 날짜를 'YYYY-MM-DD HH:mm:ss' 형태의 문자열로 변환
 * @param {number[]} date 변환 대상 날짜
 * @returns 'YYYY-MM-DD' 형태의 문자열
 */
export const toDatetimeString = (date: number[]): string => {
    return `${String(date[0])}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')} `
        +`${String(date[3]).padStart(2, '0')}:${String(date[4]).padStart(2, '0')}:${String(date[5]).padStart(2, '0')}`;
}

/**
 * Date 타입의 날짜를 'YYYY-MM-DD HH:mm:ss' 형태의 문자열로 변환
 * @param {number[]} date 변환 대상 날짜
 * @returns 'YYYY-MM-DD HH:mm:ss' 형태의 문자열
 */
export const dateToDatetimeString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `
            + `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}