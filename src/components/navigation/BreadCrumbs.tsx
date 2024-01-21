import { StyledLink } from "rakkasjs";
import { useRakkasBreadCrumbs } from "./useBreadCrumbs";
import { ChevronRight } from "lucide-react";

interface BreadCrumbsProps {}

export default function BreadCrumbs({}: BreadCrumbsProps) {
  const { breadcrumb_routes,current } = useRakkasBreadCrumbs();
  
  return (
    <div className="flex z-50 px-2 py- ">
      {breadcrumb_routes.map(({ name, path }, idx) => {
        const new_url = new URL(current);
        new_url.pathname = path;
        return (
          <StyledLink
            key={name}
            href={new_url.toString()}
            className="text-sm  hover:brightness-50 btn btn-sm "
            activeClass="text-secondary"
          >
            {name} {idx < breadcrumb_routes.length - 1 && <ChevronRight/>}
          </StyledLink>
        );
      })}
    </div>
  );
}
