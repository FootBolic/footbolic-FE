import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

interface ComponentSize {
  width: number;
  height: number;
};

function useDocumentSize(): ComponentSize {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
     
    // handleResize 함수를 debounce로 감싸고, 시간을 설정한다
    // 1000ms = 1sec
    const handleResize = debounce(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 1000);
     
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => { // cleanup 
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowSize;
}

export default useDocumentSize;