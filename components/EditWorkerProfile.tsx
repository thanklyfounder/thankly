"use client";

import { useState } from "react";

type Language = "en" | "es";

type EditWorkerProfileProps = {
  workerId: string;
  initialName: string;
  initialBio: string | null;
  initialBioEs?: string | null;
  language?: Language;
};

export default function EditWorkerProfile({
  workerId,
  initialName,
  initialBio,
  initialBioEs,
  language = "en",
}: EditWorkerProfileProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio ?? "");
  const [bioEs, setBioEs] = useState(initialBioEs ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const t = {
    title:
      language === "en"
        ? "Edit profile"
        : "Editar perfil",

    description:
      language === "en"
        ? "Update your public Thankly profile."
        : "Actualiza tu perfil público de Thankly.",

    displayName:
      language === "en"
        ? "Display name"
        : "Nombre público",

    bio:
      language === "en"
        ? "Bio"
        : "Descripción",

    bioPlaceholder:
      language === "en"
        ? "Tell people a little about yourself..."
        : "Cuéntale algo a las personas sobre ti...",

    bioEs:
      language === "en"
        ? "Bio (Spanish) — optional"
        : "Descripción (Español) — opcional",

    bioEsPlaceholder:
      language === "en"
        ? "Shown to Spanish-speaking customers on your tip page..."
        : "Se muestra a clientes hispanohablantes en tu página...",

    save:
      language === "en"
        ? "Save profile"
        : "Guardar perfil",

    saving:
      language === "en"
        ? "Saving..."
        : "Guardando...",

    success:
      language === "en"
        ? "Profile updated successfully."
        : "Perfil actualizado correctamente.",

    error:
      language === "en"
        ? "Unable to update profile."
        : "No se pudo actualizar el perfil.",
  };

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/update-worker-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
          fullName: name,
          bio,
          bioEs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || t.error);
        setSaving(false);
        return;
      }

      setMessage(t.success);
      setSaving(false);
    } catch (error) {
      console.error(error);
      setMessage(t.error);
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {t.title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {t.description}
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.displayName}
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.bio}
          </label>

          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t.bioPlaceholder}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.bioEs}
          </label>

          <textarea
            rows={4}
            value={bioEs}
            onChange={(e) => setBioEs(e.target.value)}
            placeholder={t.bioEsPlaceholder}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? t.saving : t.save}
          </button>

          {message ? (
            <p className="text-sm font-medium text-slate-600">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}