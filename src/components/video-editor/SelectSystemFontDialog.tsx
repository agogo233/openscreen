import { Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useScopedT } from "@/contexts/I18nContext";
import { getSystemFonts } from "@/lib/customFonts";

interface SelectSystemFontDialogProps {
	onFontSelected: (fontFamily: string, fontName: string) => void;
}

export function SelectSystemFontDialog({ onFontSelected }: SelectSystemFontDialogProps) {
	const t = useScopedT("settings");
	const [open, setOpen] = useState(false);
	const [systemFonts, setSystemFonts] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleOpenChange = async (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen && systemFonts.length === 0) {
			setLoading(true);
			try {
				const fonts = await getSystemFonts();
				setSystemFonts(fonts);
			} catch (error) {
				console.error("Failed to load system fonts:", error);
				toast.error(t("systemFont.errorLoadFailed"));
			} finally {
				setLoading(false);
			}
		}
	};

	const handleSelectFont = (font: string) => {
		onFontSelected(font, font);
		setOpen(false);
		toast.success(t("systemFont.selected", { fontName: font }));
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="w-full h-9 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
				>
					<Type className="w-4 h-4 mr-2" />
					{t("annotation.systemFonts")}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg bg-[#1a1a1c] border-white/10 text-slate-200 max-h-[500px] flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-slate-200">{t("annotation.selectSystemFont")}</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto mt-4">
					{loading ? (
						<div className="flex items-center justify-center py-8 text-slate-400">
							<div className="animate-pulse">{t("systemFont.loading")}</div>
						</div>
					) : systemFonts.length === 0 ? (
						<div className="text-center py-8 text-slate-400">{t("systemFont.noFontsFound")}</div>
					) : (
						<div className="grid grid-cols-2 gap-2">
							{systemFonts.map((font) => (
								<button
									key={font}
									onClick={() => handleSelectFont(font)}
									className="px-3 py-2 text-left text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/5 hover:border-white/10"
									style={{ fontFamily: font }}
								>
									{font}
								</button>
							))}
						</div>
					)}
				</div>

				<div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
					{t("systemFont.helpText")}
				</div>
			</DialogContent>
		</Dialog>
	);
}
