import React from 'react'
import Form from "next/form"
import { MapPin } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { PlacesAutocomplete } from './GoogleAutoCompletePlaces'
import { updatePage } from '../../data-access/actions/updatePage'


const SearchForm = ({ propertytypes, api_key }: { propertytypes: any; api_key:string; }) => {
    const handleRevalidate = async () => {
        await updatePage()
    }
    return (
        <>

            <Form action={'/Testclient'} className='flex md:flex-row flex-col gap-4 md:items-center md:justify-center w-full'>


                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none  font-medium   '>Location</label>
                    <PlacesAutocomplete GOOGLE_MAPS_API_KEY={api_key} />
                </div>



                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none  font-medium   '>House type</label>
                    <Select name='propertytype_name' >
                        <SelectTrigger className="w-full border-primary">
                            <SelectValue placeholder="House type" className='text-secondary' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>House type</SelectLabel>
                                {propertytypes[0] == 200 && propertytypes[1]?.results?.map((propetytype: { name: string; id: number }, idx: number) => (
                                    <SelectItem value={propetytype.name} key={idx}>{propetytype.name}</SelectItem>

                                ))}

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none font-medium   '>Rent Price</label>
                    <Input name='rent_price_max' className='relative p-2 focus:border-secondary border-primary placeholder:text-sm' type='number' placeholder='eg; 10,000' />
                </div>

              

                <div>
                    <Button className='mt-4 md:mt-8 px-4 w-full' type='submit' onClick={handleRevalidate}>Find House</Button>
                </div>


            </Form>
        </>
    )
}

export default SearchForm





