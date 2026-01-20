import { step } from '@/routes/reservations';
import { Button } from './ui/button';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';



const Calendar = () => {
    const { props } = usePage<{ date: string }>();

    const dateToday = new Date();
    const queryDate = new Date(props.date == "today" ? dateToday : props.date)

    const [selectedDate, setSelectedDate] = useState<Date>(queryDate);
    const [firstDay, setFirstDay] = useState<number>(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay());
    const [totalDay, setTotalDay] = useState<number>(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate());


    useEffect(() => {
        setFirstDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay());
        setTotalDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate());
    }, [selectedDate]);

    return (
        <Card className='mb-4 p-2'>
            <CardContent className='px-2'>

                <CardDescription className='flex justify-between items-center gap-10'>
                    <div className=''>
                        <span className=''>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</span>
                    </div>

                    <div className='flex flex-1'>
                        {
                            [...Array(9)].map((_, i) => {
                                const day = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i - 4);

                                const url_year = day.getFullYear();
                                const url_month = String(day.getMonth() + 1).padStart(2, '0'); 
                                const ulr_day = String(day.getDate()).padStart(2, '0');

                                const formattedDate = `${url_year}-${url_month}-${ulr_day}`;

                                return (
                                    <Link
                                        href={step(1, { query: { date: formattedDate } })}
                                        key={i}
                                        className='mx-auto w-full flex'
                                    >
                                        <div
                                            className={cn('p-1 w-full text-center rounded', {

                                                'bg-secondary text-black font-medium':
                                                    day.getFullYear() == queryDate.getFullYear() &&
                                                    day.getMonth() == queryDate.getMonth() &&
                                                    day.getDate() == queryDate.getDate(),

                                                'bg-primary text-white dark:text-black':
                                                    day.getFullYear() == dateToday.getFullYear() &&
                                                    day.getMonth() == dateToday.getMonth() &&
                                                    day.getDate() == dateToday.getDate(),

                                            })}
                                        >
                                            {day.getDate()} <br />
                                            <span className='text-xs'>{day.toLocaleString('en-US', { weekday: 'short' })}</span>
                                        </div>
                                        <Separator orientation='vertical' className='mx-1' />
                                    </Link>

                                )
                            })
                        }
                    </div>




                    <div className='flex items-center gap-3'>
                        <Button variant="outline" size="icon" onClick={() => { const newDate = new Date(selectedDate); newDate.setDate(selectedDate.getDate() - 9); setSelectedDate(newDate) }}><ChevronLeft /></Button>
                        <Link href={step("1", { query: { date: "today" } })}>TODAY</Link>
                        <Button variant="outline" size="icon" onClick={() => { const newDate = new Date(selectedDate); newDate.setDate(selectedDate.getDate() + 9); setSelectedDate(newDate) }}><ChevronRight /></Button>
                    </div>





                </CardDescription>
            </CardContent>
        </Card>
    )
}

export default Calendar