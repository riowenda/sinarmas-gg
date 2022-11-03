import React from "react";

interface UserCardWithUnitProps {
    tipe: string,
    clas: string
}

const SVGStopCloseCheckCircle: React.FC<UserCardWithUnitProps> = ({tipe, clas}) => {
    return (
        <>
            {tipe === "check" &&
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     className={clas}
                >
                    <path fill-rule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clip-rule="evenodd"
                    />
                </svg>
            }
            {tipe === "close" &&
                <svg className={clas}
                     xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor"
                     viewBox="0 0 22 22"
                     stroke-width="1.5" stroke="white"
                >
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            }
            {tipe === "stop" &&
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clas}
                >
                    <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                        clip-rule="evenodd"
                    />
                </svg>
            }
        </>
    );
};

export default SVGStopCloseCheckCircle;