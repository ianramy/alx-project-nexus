// src/components/common/BackButton.tsx
import { useRouter } from "next/router";
import Button from "./Button";
import { ArrowLeft } from "react-feather";

interface BackButtonProps {
    onClick?: () => void;
    className?: string;
}

export default function BackButton({ onClick, className = "" }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            onClick={onClick || (() => router.back())}
            className={`
				!h-10 !px-3 !py-2
				!text-lg !font-semibold !leading-none
				flex items-center
				${className}
			`}
            aria-label="Go back"
            title="Go back"
        >
            <span className="inline-flex items-center gap-2 leading-none">
                <ArrowLeft size={20} />
                Back
            </span>
        </Button>
    );
}
