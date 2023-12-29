import { Carousel } from "antd";
import styles from '../../styles/components/banner/Banner.module.scss'
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";

const urls = [
    "https://velog.velcdn.com/images/yhko1992/post/01218901-b7bf-4949-92c0-dffa415e20de/image.jpeg",
    "https://blog.kakaocdn.net/dn/bD9P2Q/btrGuS1ePrj/eAH3hukA6JJmIHVw1kBelK/img.png",
    "https://velog.velcdn.com/images/dbfrhr20/post/0d034a76-1f08-4a7a-8dd2-60fa63c31d9d/image.jpeg"
]

function Banner() {

    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);

    return (
        <Carousel autoplay dots={true}>
            {urls.map((url, index) => {
                return (
                    <div key={index} className={isMobile ? styles.img_container_mobile : styles.img_container_web}>
                        <img className={styles.img} src={url} />
                    </div>
                )
            })}
        </Carousel>
    )
}

export default Banner;