import React, { ReactNode } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'

const MainLayout = ({ children, navigation, buttonText, handleClick, buttonVisible }: { children: ReactNode, navigation?: any, buttonText: any, handleClick?: any, buttonVisible?: boolean }) => {
    return (
        <>
            <header className="bg-white">
                <div className="mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        {navigation}
                    </div>

                    {/* Action Button */}
                    <div className='flex items-center justify-center'>
                        <Button variant="default" className={`bg-[#DAA425] text-white ${buttonVisible ? "hidden" : ""}`} onClick={handleClick} >{buttonText}</Button>
                        <Avatar className="mx-5 cursor-pointer">
                            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                            <AvatarFallback className="bg-black text-white p-2 px-2.5">
                                OS
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>
            <div className='h-fit'>
                {children}
            </div>
        </>
    )
}

export default MainLayout