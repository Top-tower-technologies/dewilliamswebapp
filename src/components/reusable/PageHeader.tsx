"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftCircle, ChevronRight } from "lucide-react";

interface BookingHeaderProps {
    page: string;
    subpage?: string;
    icon?: boolean
}

const PageHeader: React.FC<BookingHeaderProps> = ({ page, subpage, icon = true }) => {
    const router = useRouter();

    return (
        <div className="flex justify-center gap-x-3 items-center">
            <button onClick={() => router.back()}>
                <ChevronLeftCircle size={30} className={`${icon ? "text-[#8F8F8F52] hover:text-[#000]" : "hidden"}`}  />
            </button>
            <p className="text-[20px] font-[400] text-[#8F8F8F]">{page}</p>
            <ChevronRight className={`${icon ? "" : "hidden"}`} />
            <p className="text-[20px] font-[400]">{subpage}</p>
        </div>
    );
};

export default PageHeader;
