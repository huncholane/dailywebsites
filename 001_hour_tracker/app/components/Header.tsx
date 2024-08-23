import React from 'react'

type Props = {}

const Header = (props: Props) => {
    var sectionClasses = 'h-10 my-auto bg-slate-950 rounded-md text-center px-3';
    return (
        <div className='bg-blue-700 text-red-100 flex justify-between static h-20 px-3'>
            <div className={sectionClasses}>Hour Tracker</div>
            <div className={sectionClasses}>Center</div>
            <div className={sectionClasses}>Right</div>
        </div>
    )
}

export default Header