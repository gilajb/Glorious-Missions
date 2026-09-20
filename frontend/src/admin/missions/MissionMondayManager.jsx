import { useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { ApiError } from "../../api/client";
import { deleteMission, getAdminMissions, toggleMissionPublish } from "../../api/endpoints";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../AuthContext";

function actionErrorMessage(err) {
  return err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
}

export default function MissionMondayManager() {
  const { token } = useAuth();
  const { data, loading, error, reload } = useFetch(() => getAdminMissions(token), [token]);
  const missions = data || [];
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleTogglePublish = async (id) => {
    setBusyId(id);
    setActionError(null);
    try {
      await toggleMissionPublish(id, token);
      await reload();
    } catch (err) {
      setActionError(actionErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Mission Monday post? This cannot be undone.")) return;
    setBusyId(id);
    setActionError(null);
    try {
      await deleteMission(id, token);
      await reload();
    } catch (err) {
      setActionError(actionErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-on-surface">Mission Mondays</h1>
        <Link
          to="/admin/mission-mondays/new"
          className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95"
        >
          <Icon name="add" className="text-[18px]" />
          New post
        </Link>
      </div>

      {actionError && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>
      ) : error ? (
        <p className="font-body-md text-body-md text-error">Couldn't load Mission Monday posts.</p>
      ) : missions.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl shadow-sm p-space-md"
            >
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-container">
                <SafeImage
                  src={mission.photos[0]?.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-body-md text-on-surface truncate">{mission.title}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {mission.publish_date} · {mission.county || "No county"} · {mission.photos.length} photo
                  {mission.photos.length === 1 ? "" : "s"}
                  {!mission.published && " · Draft"}
                </p>
              </div>
              <div className="flex items-center gap-space-xs shrink-0">
                <Link
                  to={`/admin/mission-mondays/${mission.id}/edit`}
                  className="px-space-sm py-space-xs bg-surface-container text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-high"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={busyId === mission.id}
                  onClick={() => handleTogglePublish(mission.id)}
                  className="px-space-sm py-space-xs bg-surface-container text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-high disabled:opacity-60"
                >
                  {mission.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  disabled={busyId === mission.id}
                  onClick={() => handleDelete(mission.id)}
                  aria-label="Delete"
                  className="px-space-sm py-space-xs text-error rounded hover:bg-error-container/40 disabled:opacity-60"
                >
                  <Icon name="delete" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
