import dayjs from "dayjs"

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
 * 현재시간을 milliseconds로 리턴한다
 * @returns {number} 현재시간 milliseconds
 */
export const getTime = () => {
    return new Date().getTime();
}