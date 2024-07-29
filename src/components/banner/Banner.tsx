import { Carousel } from "antd";
import styles from '../../styles/components/banner/Banner.module.scss'
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { useQuery } from "react-query";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { BannerAPI } from "../../api/banner/BannerAPI";
import { useEffect, useState } from "react";
import { BannerInterface } from "../../types/entity/banner/BannerInterface";

function Banner() {

    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const [banners, setBanners] = useState<BannerInterface[]>([]);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);

    const { refetch } = useQuery({
        queryKey: [API_QUERY_KEYS.BANNER.GET_PUBLIC_BANNERS],
        queryFn: () => BannerAPI.getPublicBanners(isMobile),
        enabled: isEnabled,
        onSuccess: ({ banners }) => setBanners(banners) ,
        onSettled: () => setIsEnabled(false)
    })

    useEffect(() => {
        refetch();
    }, [isMobile])

    return (
        <Carousel autoplay dots={true}>
            {
                banners.map((banner, idx) => {
                    return (
                        <div key={idx} className={isMobile ? styles.img_container_mobile : styles.img_container_web}>
                            <img 
                                className={styles.img}
                                src={`${import.meta.env.VITE_API_URL_DEV}/files/public/images/${banner.file!.id}`}
                            />
                        </div>
                    )
                })
            }
        </Carousel>
    )
}

export default Banner;