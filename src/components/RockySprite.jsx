import React, { useId } from 'react'
import rockyReference from '../../rocky.jpeg'

// Masks follow the reference's pixel contours on its original 100 × 100 grid.
// Each limb keeps the original texture and proportions when it moves.
const CONTOURS = {
    body: 'M48 27H54V28H56V27H62V28H63V29H64V30H65V31H64V32H63V33H62V34H63V35H64V36H65V37H66V42H67V46H66V54H65V62H64V64H62V65H61V67H58V68H44V67H42V66H40V65H39V63H38V61H37V58H36V56H35V51H36V47H37V45H39V44H41V43H42V40H41V38H39V37H36V36H38V34H40V33H41V32H42V31H43V30H44V29H46V28H48Z',
    leftUpper: 'M18 39H21V37H24V35H35V36H39V37H42V38H43V43H42V45H39V46H28V45H24V44H18V43H16V41H18Z',
    leftFore: 'M16 7H19V8H20V10H21V11H22V13H23V16H24V15H26V16H27V19H26V20H24V22H23V34H22V39H21V41H20V42H16V40H15V37H14V37H14V27H13V23H14V20H15V18H16V17H15V16H14V15H13V13H14V12H15V13H16V14H17V13H16Z',
    rightUpper: 'M66 28H74V29H76V30H78V31H82V32H84V33H86V34H87V35H89V36H91V40H90V41H89V42H83V41H73V40H69V39H68V38H66V37H64V36H63V35H62V34H61V33H62V32H63V31H64V30H65V29H66Z',
    rightFore: 'M90 12H92V13H93V14H94V17H95V18H96V20H96V23H95V31H94V33H93V35H92V37H90V38H88V36H86V35H85V33H83V32H83V29H84V27H85V25H86V23H85V22H84V21H84V20H85V19H86V18H88V17H89V15H89V13H90Z',
    leftLeg: 'M27 45H35V46H36V48H35V51H33V54H31V57H28V59H25V62H22V65H20V66H21V68H22V70H23V73H24V76H25V79H26V81H27V82H28V83H29V89H28V90H20V91H18V89H18V86H16V85H14V83H13V81H12V79H11V76H10V73H9V70H8V69H6V68H6V62H7V61H8V60H12V61H13V60H15V57H17V55H20V53H23V50H25V47H27Z',
    middleLeg: 'M35 53H38V61H40V64H41V82H40V84H39V86H38V87H35V86H35V83H34V81H34V77H33V75H33V71H32V69H32V65H31V62H30V61H31V58H32V56H33V55H35Z',
    rightLeg: 'M66 42H75V43H77V44H78V45H79V46H81V47H83V48H84V49H85V50H86V51H87V52H88V53H89V55H90V57H91V59H90V77H89V79H88V82H87V84H86V85H84V84H83V81H82V77H81V72H80V65H79V62H77V61H74V59H72V57H70V56H69V54H67V53H66V51H65V48H65V44H66Z',
}

// Angles are around the source-image joints. Sleeping hands fold inward as
// complete forearms, so wrist/finger orientation cannot reverse independently.
const POSES = [
    { states: 'idle0 idle1', left: 0, right: 0 },
    { states: 'walk0', left: -3, right: 3, leftStep: -2, middleStep: 0, rightStep: 2 },
    { states: 'walk1', left: 3, right: -3, leftStep: 2, middleStep: -2, rightStep: -2 },
    { states: 'amaze0', left: -4, right: 4 },
    { states: 'amaze1', left: 4, right: -4 },
    { states: 'sleep0 sleep1', seated: true, left: 105, right: -105 },
    { states: 'code0', seated: true, left: 70, rightUpper: 60, right: 120, prop: 'code' },
    { states: 'code1', seated: true, left: 70, rightUpper: 60, right: 116, prop: 'code' },
    { states: 'game0', seated: true, left: 65, rightUpper: 30, right: 60, prop: 'game' },
    { states: 'game1', seated: true, left: 65, rightUpper: 30, right: 57, prop: 'game' },
]

export default function RockySprite({ width, height }) {
    const id = useId().replace(/:/g, '')
    const part = name => (
        <g clipPath={`url(#${id}-${name})`} data-limb={name}>
            <use href={`#${id}-texture`} />
        </g>
    )

    return (
        <svg viewBox="0 0 76 48" width={width} height={height} shapeRendering="crispEdges" focusable="false">
            <defs>
                <image id={`${id}-texture`} href={rockyReference} width="100" height="100" style={{ imageRendering: 'pixelated' }} />
                {Object.entries(CONTOURS).map(([name, d]) => (
                    <clipPath id={`${id}-${name}`} key={name}><path d={d} /></clipPath>
                ))}
            </defs>
            {POSES.map(pose => (
                <g data-p={pose.states} key={pose.states}>
                    <g transform="translate(3 -2) scale(.5)">
                        <g transform={`translate(0 ${pose.middleStep || 0})`}>{part('middleLeg')}</g>
                        <g transform={`rotate(${pose.seated ? -12 : pose.leftStep || 0} 31 47)`}>{part('leftLeg')}</g>
                        <g transform={`rotate(${pose.seated ? 12 : pose.rightStep || 0} 68 46)`}>{part('rightLeg')}</g>
                        <g transform={`translate(0 ${pose.seated ? 6 : 0})`}>
                            {part('body')}
                            {part('leftUpper')}
                            <g transform={`rotate(${pose.rightUpper || 0} 66 34)`}>{part('rightUpper')}</g>
                            <g transform={`rotate(${pose.left} 18 39)`}>{part('leftFore')}</g>
                        </g>
                    </g>
                    {/* Props precede the working hand: fingers always remain visible. */}
                    {pose.prop === 'code' && (
                        <g>
                            <path d="M38 42H64V44H38ZM62 24H65V42H62Z" className="px-k" />
                            <path d={pose.states === 'code0' ? 'M61 26V28M61 31V33M61 36V38' : 'M61 28V30M61 33V35M61 38V40'} stroke="var(--yellow)" />
                        </g>
                    )}
                    {pose.prop === 'game' && (
                        <g>
                            <path d="M51 25H65V31H51Z" className="px-v" />
                            <path d="M54 26V30M52 28H56" stroke="var(--ink)" />
                            <path d={pose.states === 'game0' ? 'M62 27H64M60 29H62' : 'M61 27H63M62 29H64'} stroke="var(--yellow)" />
                        </g>
                    )}
                    <g transform="translate(3 -2) scale(.5)">
                        <g transform={`translate(0 ${pose.seated ? 6 : 0})`}>
                            <g transform={`rotate(${pose.rightUpper || 0} 66 34)`}>
                                <g transform={`rotate(${pose.right} 88 38)`}>{part('rightFore')}</g>
                            </g>
                        </g>
                    </g>
                </g>
            ))}
            <path data-p="sleep0 sleep1" d="M51 7H56L51 11H56" fill="none" stroke="var(--violet)" />
            <path data-p="sleep1" d="M58 2H62L58 5H62" fill="none" stroke="var(--violet)" />
        </svg>
    )
}
