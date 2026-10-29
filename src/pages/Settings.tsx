import { useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  Mail,
  MapPin,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";
import { loadSettings, saveSettings, type SettingsState } from "../utils/settings";

function Settings() {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    try {
      saveSettings(settings);
      setSaved(true);
      setSaveError("");
    } catch {
      setSaved(false);
      setSaveError("Unable to save settings. Please check browser storage and try again.");
    }
  };

  const handleReset = () => {
    setSettings(loadSettings());
    setSaved(false);
    setSaveError("");
  };

  return (
    <main className="mx-auto w-full max-w-5xl p-6 md:p-8">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">PREFERENCES</p>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">Settings</h1>
          <p className="mt-2 text-text-secondary">Manage your profile and application preferences.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-slate-50"><RotateCcw size={16} aria-hidden="true" /> Reset</button>
          <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"><Save size={16} aria-hidden="true" /> Save changes</button>
        </div>
      </header>

      {saved && <p role="status" className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><Check size={17} aria-hidden="true" /> Your preferences were saved.</p>}
      {saveError && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{saveError}</p>}

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start gap-3"><div className="rounded-xl bg-indigo-50 p-2.5 text-primary"><UserRound size={20} aria-hidden="true" /></div><div><h2 className="font-semibold text-text-primary">Profile</h2><p className="mt-1 text-sm text-text-secondary">Keep your career profile ready for personalized recommendations.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-text-primary">Full name<input value={settings.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your name" className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <label className="text-sm font-medium text-text-primary">Email address<div className="relative"><Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-border bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div></label>
            <label className="text-sm font-medium text-text-primary">Target role<div className="relative"><BriefcaseBusiness size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={settings.targetRole} onChange={(event) => update("targetRole", event.target.value)} placeholder="e.g. Frontend Developer" className="mt-2 w-full rounded-xl border border-border bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div></label>
            <label className="text-sm font-medium text-text-primary">Preferred location<div className="relative"><MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={settings.preferredLocation} onChange={(event) => update("preferredLocation", event.target.value)} placeholder="Remote, Bengaluru, etc." className="mt-2 w-full rounded-xl border border-border bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div></label>
          </div>
          <label className="mt-5 block text-sm font-medium text-text-primary">Job search status<select value={settings.searchStatus} onChange={(event) => update("searchStatus", event.target.value as SettingsState["searchStatus"])} className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:max-w-md"><option value="actively-looking">Actively looking</option><option value="open-to-opportunities">Open to opportunities</option><option value="not-looking">Not looking right now</option></select></label>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Bell size={20} aria-hidden="true" /></div><div><h2 className="font-semibold text-text-primary">Notifications</h2><p className="mt-1 text-sm text-text-secondary">Choose which updates CareerPilot should send you.</p></div></div>
          <div className="divide-y divide-border">
            <Toggle label="Job match alerts" description="Get notified when new opportunities match your profile." checked={settings.emailAlerts} onChange={(value) => update("emailAlerts", value)} />
            <Toggle label="Weekly career digest" description="Receive a weekly summary of your activity and saved jobs." checked={settings.weeklyDigest} onChange={(value) => update("weeklyDigest", value)} />
            <Toggle label="Save strong matches automatically" description="Automatically add high-scoring matches to Saved Jobs." checked={settings.saveMatchesAutomatically} onChange={(value) => update("saveMatchesAutomatically", value)} />
          </div>
        </section>
      </div>
    </main>
  );
}

type ToggleProps = { label: string; description: string; checked: boolean; onChange: (value: boolean) => void };

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><span><span className="block text-sm font-semibold text-text-primary">{label}</span><span className="mt-1 block text-sm leading-5 text-text-secondary">{description}</span></span><span className="relative shrink-0"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" /><span className="block h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30" /><span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" /></span></label>;
}

export default Settings;
