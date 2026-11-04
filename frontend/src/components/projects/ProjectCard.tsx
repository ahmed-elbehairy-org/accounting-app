import type { Project } from "../../types";
import { DeleteButton } from "../common/DeleteButton";
import { UserPlus, ArrowLeft, Edit2 } from "lucide-react";

interface Props {
	project: Project;
	onAllocate: (project: Project) => void;
	onSelect: (project: Project) => void;
	onEdit: (project: Project) => void;
	onDelete: (id: string) => void;
}

export function ProjectCard({ project, onAllocate, onSelect, onEdit, onDelete }: Props) {
	const target = Math.max(1, project.targetShares || 100);
	const allocated = project.totalAllocatedShares || 0;
	const progress = Math.min(100, Math.round((allocated / target) * 100));
	const capital = allocated * (project.shareUnitPrice || 1000);
	const investorCut = 100 - (project.workerProfitPercentage || 20);

	return (
		<div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
			<div onClick={() => onSelect(project)} className="cursor-pointer">
				<div className="flex items-center justify-between mb-2">
					<span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
						{project.code}
					</span>
					<div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1">
						<button
							onClick={() => onEdit(project)}
							className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition"
							title="تعديل بيانات المشروع"
						>
							<Edit2 className="w-3.5 h-3.5" />
						</button>
						<DeleteButton onDelete={() => onDelete(project.id)} />
					</div>
				</div>
				<h3 className="font-bold text-slate-100 text-sm hover:text-indigo-400 transition">
					{project.name}
				</h3>
				<p className="text-xs text-slate-400 mt-1">
					العامل: {project.workerName || "غير محدد"}
				</p>
			</div>

			<div onClick={() => onSelect(project)} className="my-4 space-y-2 cursor-pointer">
				<div className="flex justify-between text-xs text-slate-400">
					<span>الاكتتاب ({allocated}/{target})</span>
					<span className="text-slate-200 font-semibold">{progress}%</span>
				</div>
				<div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
					<div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
				</div>
				<div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
					<div className="bg-slate-950/60 p-2 rounded-xl">
						<span className="text-slate-500 block">رأس المال المجمع</span>
						<span className="font-semibold text-slate-200">{capital.toLocaleString()} ج</span>
					</div>
					<div className="bg-slate-950/60 p-2 rounded-xl">
						<span className="text-slate-500 block">نسبة المضاربة</span>
						<span className="text-amber-400 font-semibold">
							{project.workerProfitPercentage}% عامل / {investorCut}% شركاء
						</span>
					</div>
				</div>
			</div>

			<div className="flex gap-2 pt-2 border-t border-slate-800/80">
				<button
					onClick={() => onAllocate(project)}
					className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition"
				>
					<UserPlus className="w-3.5 h-3.5" /> تخصيص أسهم
				</button>
				<button
					onClick={() => onSelect(project)}
					className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition"
				>
					دخول التفاصيل <ArrowLeft className="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	);
}
