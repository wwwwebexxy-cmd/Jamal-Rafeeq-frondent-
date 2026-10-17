const DEFAULT_HOMEPAGE_VIDEO_SOURCES = {
    brandShowcase: "https://videos.pexels.com/video-files/7018666/7018666-uhd_4096_2160_25fps.mp4",
    globalReachPortrait: "https://videos.pexels.com/video-files/11801945/11801945-hd_1080_1920_30fps.mp4",
    globalReachLandscape: "https://videos.pexels.com/video-files/5371527/5371527-hd_1920_1080_30fps.mp4",
};

export const HOMEPAGE_MEDIA_FIELDS = [
    {
        name: "brand_showcase_video",
        sourceKey: "brandShowcase",
        label: "Brands across our supply network",
        help: "Video displayed beneath the brand showcase section.",
    },
    {
        name: "global_reach_portrait_video",
        sourceKey: "globalReachPortrait",
        label: "Our Global Reach — portrait video",
        help: "The first video in the Our Global Reach section.",
    },
    {
        name: "global_reach_landscape_video",
        sourceKey: "globalReachLandscape",
        label: "Our Global Reach — landscape video",
        help: "The second video in the Our Global Reach section.",
    },
];

export { DEFAULT_HOMEPAGE_VIDEO_SOURCES };

export const getVideoMimeType = (source, fallback = "video/mp4") => {
    if (!source) return fallback;

    const extension = String(source)
        .split(/[?#]/, 1)[0]
        .split(".")
        .pop()
        ?.toLowerCase();

    return {
        mp4: "video/mp4",
        m4v: "video/mp4",
        webm: "video/webm",
        ogg: "video/ogg",
        ogv: "video/ogg",
    }[extension] || fallback;
};
