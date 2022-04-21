import { FC, useState, useEffect } from "react";
import { useZakeke } from "zakeke-configurator-react";
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import fbIcon from '../../assets/images/social/facebook.png';
import pinIcon from '../../assets/images/social/pinterest.png';
import twitIcon from '../../assets/images/social/twitter.png';
import emailIcon from '../../assets/images/social/email.png';
import { Dialog } from "./Dialogs";
import { T } from "Helpers";

declare const Zakeke: any;

const ShareDialogContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;    
    grid-gap:30px;    
    padding:20px;
`;

const SharePreviewImg = styled.img`
    width: 100%; 
    max-width: 250px; 
    height: 100%; 
    max-height: 300px;
    object-fit:contain;
`;

const SocialContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    align-self: center;
    grid-gap: 30px;
`;

const SocialIcon = styled.div`
    img{
        width:80px;
        height:80px; 
        cursor:pointer; 

        @media(hover) {
            &:hover {
                opacity: 0.7;
            }
        }
    }
`;

const ShareDialog: FC<{}> = () => {

    const [url, setUrl] = useState("");

    const [file, setFile] = useState<File | null>(null);

    const isMobile = window.innerWidth < 768;

    const { getOnlineScreenshot } = useZakeke();


    const fetchImageToBlob = async (url: string) => {
        const response = await fetch(url);
        let blob = await response.blob();
        let file = new File([blob], "share.png", { type: blob.type });
        return file;
    }

    useEffect(() => {
        getOnlineScreenshot(1024, 1024, '#FFFFFF').then(async url => {
            const file = await fetchImageToBlob(url);
            setUrl(url);
            setFile(file);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFacebookClick = () => {
        if (!url)
            return;

        openWindow("https://www.facebook.com/dialog/feed?app_id=" + Zakeke.config.facebookAppID + "&display=popup&link=" + encodeURIComponent(url), "Facebook", 500, 500);

    }

    const handlePinterestClick = () => {
        if (!url)
            return;

        openWindow("https://pinterest.com/pin/create/bookmarklet/?media=" + encodeURIComponent(url) + "&url=zakeke.com&is_video=0&description=", "Pinterest", 500, 500);

    }

    const handleTwitterClick = () => {
        if (!url)
            return;

        openWindow("https://twitter.com/intent/tweet?text=" + encodeURIComponent(url), "Twitter", 500, 500);
    }

    const handleEmailClick = () => {
        if (!url)
            return;

        let mailLink = `mailto:?subject=&body=${encodeURIComponent(url)}`;
        let newTabLink = document.createElement('a');
        newTabLink.setAttribute('href', mailLink);
        newTabLink.setAttribute('target', '_blank');
        document.body.appendChild(newTabLink);
        newTabLink.click();
        newTabLink.remove();
    }

    const openWindow = (url: string, name: string, width: number, height: number) => {
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        return window.open(url, name, "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",menubar=no,location=no,status=no,toolbar=no");
    }

    const handleOnShareClick = () => {
        const fileShare = file;
        try {

            if (fileShare && (navigator as any).canShare && (navigator as any).canShare({ files: [fileShare] })) {

                (navigator as any).share({
                    files: [fileShare],
                    title: 'Share',
                    text: '',
                });
            }
            else {
                (navigator as any).share({ url: url });
            }
        }
        catch (ex) {
            alert((ex as any).message);
        }
    }

    let buttons: ({ label: string, onClick: () => void })[] = [];

    if (isMobile && navigator.share) {
        buttons = [
            { label: T._('Share', 'Composer'), onClick: handleOnShareClick },
        ];
    }

    return <Dialog title={T._('Share', 'Composer')} buttons={buttons}>
        <ShareDialogContainer>

            {url !== "" && <SharePreviewImg src={url} alt="preview" />}
            {url === "" && <Loader type="TailSpin" color="#000000" />}

            {(!isMobile || !navigator.share) && <SocialContainer>
                <SocialIcon title="Facebook" onClick={() => handleFacebookClick()}><img src={fbIcon} alt="Facebook" /></SocialIcon>
                <SocialIcon title="Pinterest" onClick={() => handlePinterestClick()}><img src={pinIcon} alt="Pinterest" /></SocialIcon>
                <SocialIcon title="Twitter" onClick={() => handleTwitterClick()}><img src={twitIcon} alt="Twitter" /></SocialIcon>
                <SocialIcon title="Email" onClick={() => handleEmailClick()}><img src={emailIcon} alt="Email" /></SocialIcon>
            </SocialContainer>}
        </ShareDialogContainer>
    </Dialog>;
}
export default ShareDialog;