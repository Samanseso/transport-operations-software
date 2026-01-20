import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Copy, FileText, MessageCircle, Phone, Star } from 'lucide-react'
import { Badge } from './ui/badge';
import React from 'react'
import AvatarImageSource from '../../../public/assets/images/avatar.png';
import { Driver } from '@/types';
import { Button } from './ui/button';


const TabDriverInformation = ({ driver }: { driver: Driver }) => {
    return (
        <div className='px-4 py-3'>
            <div className="flex justify-between mb-3">
                <div className='flex items-center gap-2'>
                    <Avatar className='size-10'>
                        <AvatarImage src={AvatarImageSource} />
                    </Avatar>
                    <div>
                        <p className='text-sm font-bold'>Evander Wines</p>
                        <p className='text-xs text-gray-500'>Driver</p>
                    </div>

                    <div className='rounded-full p-2 bg-gray-200'>
                        <FileText size={15} />
                    </div>
                </div>
                <div className='space-x-2 flex items-center'>
                    <Button size='sm' className='rounded-full bg-sky-400 w-20'>
                        <Phone />
                        Call
                    </Button>

                    <Button size='sm' variant='outline' className='rounded-full border-sky-400 text-sky-400 w-20'>
                        <MessageCircle />
                        Chat
                    </Button>
                </div>
            </div>
            <div className='flex gap-12'>
                <div className=''>
                    <p className='text-xs text-gray-500'>Experience</p>
                    <p className='text-xs font-bold'>12 years</p>
                </div>

                <div className=''>
                    <p className='text-xs text-gray-500'>Driver's License</p>
                    <p className='text-xs font-bold'>{driver.license_number}</p>
                </div>

                <div className=''>
                    <p className='text-xs text-gray-500'>ID number</p>
                    <p className='text-xs font-bold'>{driver.driver_id}</p>
                </div>

                <div className=''>
                    <p className='text-xs text-gray-500'>Contact number</p>
                    <p className='text-xs font-bold'>{driver.contact_number}</p>
                </div>

                <div className=''>
                    <p className='text-xs text-gray-500'>Insurance number</p>
                    <p className='text-xs font-bold'>987-65-4321</p>
                </div>
            </div>
        </div>
    )
}

export default TabDriverInformation