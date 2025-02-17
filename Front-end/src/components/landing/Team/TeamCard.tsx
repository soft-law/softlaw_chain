import React from 'react';

interface TeamcardProps {
    name: string;
    role: string;
}


const Teamcard: React.FC<TeamcardProps> = ({name, role}) => {
    return (
        <div className='flex md:min-w-[320px] min-[2000px]:w-[500px] flex-col items-start justify-between font-Montesarrat text-[#FFF] min-[2000px]:gap-2 '>
            <h1 className='text-[28px] font-[500] leading-[32px] tracking-[-0.56px] uppercase min-[2000px]:text-4xl min-[2000px]:tracking-[2px]'>{name}</h1>
            <p className='text-[16px] font-normal leading-[145%] tracking-[0.32px] min-[2000px]:text-3xl min-[2000px]:tracking-[2px]'>{role}</p>
        </div>
    )
}
export default Teamcard;