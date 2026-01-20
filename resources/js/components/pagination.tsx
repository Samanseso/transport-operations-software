import { PaginationLink, PaginationType } from "@/types";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

interface PaginationProps {
    data: PaginationType<any>;
}

function getVisiblePages(links: PaginationLink[], current: number, total: number, offset: number = 2): PaginationLink[] {
    let start = current - offset;
    let end = current + offset;

    // If start goes below 1, shift the window right
    if (start < 1) {
        end += 1 - start;
        start = 1;
    }

    // If end exceeds total pages, shift the window left
    if (end > total) {
        start -= end - total;
        end = total;
    }

    // Clamp start to at least 1
    start = Math.max(start, 1);

    // Build the page list
    const pages: PaginationLink[] = [];
    for (let i = start; i <= end; i++) {
        pages.push(links[i]);
    }

    return pages;
}





export function Pagination ({ data }: PaginationProps) {
    const visiblePages = getVisiblePages(data.links, data.current_page, data.last_page, 1);

    return (        
        <div className="flex justify-between absolute bottom-6 right-0 pr-8 space-x-10">
            {/* I don't know why but pr-8 works ------------------------^ */}
            <div>
                <Link href={data.prev_page_url ?? ""}>
                    <Button variant="outline" size="sm" disabled={data.prev_page_url == null}>
                        <ArrowLeft />
                        Previous
                    </Button>
                </Link>
            </div>
            <div className="flex space-x-2">
                {visiblePages.map((page, index) => (
                    <Button 
                        key={index} 
                        variant="outline" 
                        disabled={page.url == null} 
                        size="sm"
                        className={`${page.label === data.current_page.toString() ? 'bg-sky-500 text-white' : ''}`}
                        asChild
                    >
                        <Link href={page.url}> 
                            {page.label}
                        </Link>
                    </Button>   
                ))}
            </div>
            <div>
                <Link href={data.next_page_url ?? ""}>
                    <Button variant="outline" size="sm" disabled={data.next_page_url == null} className="cursor-pointer">
                        Next
                        <ArrowRight />
                    </Button>
                </Link>
                
            </div>
        </div>
    )
}