import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiExternalLink, FiFilm, FiSave } from "react-icons/fi";
import { LoadingState, PageHeader } from "../components/AdminPrimitives";
import { createHomepageMedia, getErrorMessage, listHomepageMedia, unwrapList, updateHomepageMedia } from "../services/adminApi";
import { getImageUrl } from "../../../utils/imageUrl";
import "../styles/HomepageMediaEditor.css";

const mediaFields = [
    { name: "brand_showcase_video", label: "Brands across our supply network", help: "Video displayed beneath the brand showcase section." },
    { name: "global_reach_portrait_video", label: "Our Global Reach — portrait video", help: "The first video in the Our Global Reach section." },
    { name: "global_reach_landscape_video", label: "Our Global Reach — landscape video", help: "The second video in the Our Global Reach section." },
];

const DEFAULT_MEDIA_PREVIEWS = {
    brand_showcase_video: "https://videos.pexels.com/video-files/7018666/7018666-uhd_4096_2160_25fps.mp4",
    global_reach_portrait_video: "https://videos.pexels.com/video-files/11801945/11801945-hd_1080_1920_30fps.mp4",
    global_reach_landscape_video: "https://videos.pexels.com/video-files/5371527/5371527-hd_1920_1080_30fps.mp4",
};

const emptyValues = Object.fromEntries(mediaFields.map(({ name }) => [name, null]));
const idOf = (row) => row?.id ?? row?.pk;

const errorMap = (error) => {
    const data = error?.response?.data;
    return data && typeof data === "object"
        ? Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : String(value)]))
        : {};
};

export default function HomepageMediaEditor() {
    const queryClient = useQueryClient();
    const [values, setValues] = useState(emptyValues);
    const [mediaId, setMediaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [errors, setErrors] = useState({});

    const previews = useMemo(() => Object.fromEntries(mediaFields.map(({ name }) => {
        const value = values[name];
        return [name, value instanceof File ? URL.createObjectURL(value) : getImageUrl(value) || DEFAULT_MEDIA_PREVIEWS[name]];
    })), [values]);

    useEffect(() => () => {
        mediaFields.forEach(({ name }) => {
            const value = values[name];
            if (value instanceof File && previews[name]) URL.revokeObjectURL(previews[name]);
        });
    }, [previews, values]);

    useEffect(() => {
        let active = true;
        listHomepageMedia()
            .then((response) => {
                if (!active) return;
                const row = unwrapList(response.data).rows[0];
                if (!row) return;
                setMediaId(idOf(row));
                setValues(Object.fromEntries(mediaFields.map(({ name }) => [name, row[name] || null])));
            })
            .catch((error) => { if (active) setRequestError(getErrorMessage(error, "Could not load homepage media.")); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const setValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));
    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        setRequestError("");
        setErrors({});
        const form = new FormData();
        mediaFields.forEach(({ name }) => {
            if (values[name] instanceof File) form.append(name, values[name]);
        });
        try {
            const response = mediaId
                ? await updateHomepageMedia(mediaId, form)
                : await createHomepageMedia(form);
            const saved = response.data;
            setMediaId(idOf(saved) || mediaId);
            setValues((current) => Object.fromEntries(mediaFields.map(({ name }) => [name, saved?.[name] || current[name]])));
            await queryClient.invalidateQueries({ queryKey: ["homepage"] });
            toast.success("Homepage videos updated");
        } catch (error) {
            setErrors(errorMap(error));
            setRequestError(getErrorMessage(error, "Could not save homepage media."));
            toast.error(getErrorMessage(error, "Could not save homepage media."));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-page"><LoadingState label="Loading homepage media…" /></div>;

    return <div className="admin-page homepage-media-page">
        <PageHeader eyebrow="MARKETING" title="Homepage Media" description="Change the videos shown in the supply network and global reach sections." />
        <form className="homepage-media-panel" onSubmit={save}>
            <div className="homepage-media-intro"><FiFilm aria-hidden="true" /><p>Choose a new MP4, WebM, or OGG file for any slot you want to change. Slots left untouched continue using their current video.</p></div>
            <div className="homepage-media-grid">
                {mediaFields.map(({ name, label, help }) => {
                    const preview = previews[name];
                    return <label className={`homepage-media-field ${errors[name] ? "has-error" : ""}`} key={name}>
                        <span>{label}</span>
                        <small>{help}</small>
                        {preview ? <>
                            <small className="homepage-media-source">{values[name] ? "Current uploaded video" : "Default spare-parts stock video"}</small>
                            <video className="homepage-media-preview" src={preview} controls muted playsInline preload="metadata" aria-label={`${label} preview`} />
                            <a className="homepage-media-open" href={preview} target="_blank" rel="noreferrer"><FiExternalLink aria-hidden="true" /> Open video in new tab</a>
                        </> : <p className="homepage-media-empty">No uploaded video yet. The storefront will use the default spare-parts video.</p>}
                        <input type="file" accept="video/mp4,video/webm,video/ogg" onChange={(event) => setValue(name, event.target.files?.[0] || null)} />
                        {errors[name] && <em>{errors[name]}</em>}
                    </label>;
                })}
            </div>
            {requestError && <p className="homepage-media-error" role="alert">{requestError}</p>}
            <div className="homepage-media-actions"><button className="admin-button primary" type="submit" disabled={saving}><FiSave aria-hidden="true" /> {saving ? "Saving…" : "Save homepage videos"}</button></div>
        </form>
    </div>;
}
