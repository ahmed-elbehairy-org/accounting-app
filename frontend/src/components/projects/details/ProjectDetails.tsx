import { useState } from 'react'
import type { Project } from '../../../types'
import { ProjectHeaderNav, type ProjectSubTab } from './ProjectHeaderNav'
import { ProjectPartnersTab } from './ProjectPartnersTab'
import { ProjectCashflowTab } from './ProjectCashflowTab'
import { ProjectDistributionsTab } from './ProjectDistributionsTab'
import { ProjectLiquidationTab } from './ProjectLiquidationTab'

interface Props {
  project: Project
  onBack: () => void
  onRefreshParent: () => void
}

export function ProjectDetails({ project, onBack, onRefreshParent }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<ProjectSubTab>('partners')

  return (
    <div className="space-y-6">
      <ProjectHeaderNav
        project={project}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        onBack={onBack}
      />

      <div className="pt-2">
        {activeSubTab === 'partners' && (
          <ProjectPartnersTab project={project} onRefreshProject={onRefreshParent} />
        )}
        {activeSubTab === 'cashflow' && <ProjectCashflowTab project={project} />}
        {activeSubTab === 'distributions' && <ProjectDistributionsTab project={project} />}
        {activeSubTab === 'liquidation' && (
          <ProjectLiquidationTab project={project} onProjectUpdated={onRefreshParent} />
        )}
      </div>
    </div>
  )
}

