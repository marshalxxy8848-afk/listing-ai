"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProjectRecord } from "@/lib/types";
import { toast } from "sonner";

function ProjectsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-[var(--border)] p-4">
          <div className="h-4 w-1/2 rounded bg-[var(--secondary)]" />
          <div className="mt-2 h-3 w-1/4 rounded bg-[var(--secondary)]" />
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("amazon");
  const supabase = createClient();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setProjects(data as ProjectRecord[]);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name,
      platform,
    });

    if (error) {
      toast.error("Failed to create project");
      return;
    }

    toast.success("Project created");
    setName("");
    setShowForm(false);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Group your listings by product
            </p>
          </div>
        </div>
        <ProjectsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Group your listings by product
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "New Project"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-[var(--border)] p-4 space-y-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            required
            className="block w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <div className="flex gap-2">
            {(["amazon", "shopify", "ebay", "aliexpress", "temu", "tiktok"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-lg border px-4 py-1.5 text-sm capitalize ${
                  platform === p
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border-[var(--border)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
          >
            Create
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <div className="text-4xl text-[var(--muted-foreground)] mb-4">📁</div>
          <p className="text-sm text-[var(--muted-foreground)]">
            No projects yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4 hover:bg-[var(--secondary)]/50 transition-colors"
            >
              <div>
                <h3 className="text-sm font-medium">{project.name}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {project.platform} ·{" "}
                  {new Date(project.created_at).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
