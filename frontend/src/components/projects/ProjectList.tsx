import { useState } from 'react'
import type { Project } from '../../types'
import { ProjectCard } from './ProjectCard'
import { ProjectFormModal } from './ProjectFormModal'
import { AllocateSharesModal } from './AllocateSharesModal'
import { ProjectDetails } from './details/ProjectDetails'
import { Plus, FolderKanban } from 'lucide-react'

interface Props {
  projects: Project[]
  loading: boolean
  onRefresh: () => void
  onDelete: (id: string) => void
}

export function ProjectList({ projects, loading, onRefresh, onDelete }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [allocatingProject, setAllocatingProject] = useState<Project | null>(null)

  if (selectedProject) {
    const fresh = projects.find((p) => p.id === selectedProject.id) || selectedProject
    return (
      <ProjectDetails
        project={fresh}
        onBack={() => setSelectedProject(null)}
        onRefreshParent={onRefresh}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl"><FolderKanban className="w-5 h-5" /></div>
          <div>
            <h2 className="text-base font-bold text-white">مشاريع المضاربة الشرعية</h2>
            <p className="text-xs text-slate-400">إدارة حصص العامل والشركاء وتوزيع الأرباح والتصفية</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingProject(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          مشروع جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">جاري تحميل المشاريع...</div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">لا توجد مشاريع مضاربة حالية</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProject(p)}
              onAllocate={(p) => setAllocatingProject(p)}
              onEdit={(p) => { setEditingProject(p); setIsModalOpen(true) }}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={isModalOpen}
        project={editingProject}
        onClose={() => { setIsModalOpen(false); setEditingProject(null) }}
        onSaved={onRefresh}
      />
      <AllocateSharesModal project={allocatingProject} onClose={() => setAllocatingProject(null)} onAllocated={onRefresh} />
    </div>
  )
}
