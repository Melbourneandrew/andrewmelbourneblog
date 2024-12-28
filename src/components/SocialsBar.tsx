import GithubIcon from "@/components/icons/github";
import LinkedinIcon from "@/components/icons/linkedin";
import XIcon from "@/components/icons/x";
import PortfolioIcon from "./icons/portfolio";

export default function SocialsBar() {
    const links = {
        github: "https://github.com/Melbourneandrew",
        linkedin: "https://www.linkedin.com/in/melbourneandrew/",
        twitter: "https://x.com/andrew_melby",
        devpost: "https://devpost.com/Melbourneandrew",
        huggingface: "https://huggingface.co/M3LBY",
        portfolio: "https://melbournedev.com",
    };

    return (
        <div className="flex flex-row gap-4 mb-[30px] w-fit mx-auto">
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1"
                href={links.github}
            >
                <GithubIcon /> Github
            </a>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1"
                href={links.linkedin}
            >
                <LinkedinIcon /> LinkedIn
            </a>
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1"
                href={links.twitter}
            >
                <XIcon /> Twitter
            </a>
            {/* <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1"
                href={links.devpost}
            >
                <DevpostIcon /> Devpost
            </a> */}
            <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1"
                href={links.portfolio}
            >
                <PortfolioIcon /> Portfolio
            </a>
        </div>
    );
};
