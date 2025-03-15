import React from 'react'
import Form from "next/form"
import { MapPin } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { PlacesAutocomplete } from './GoogleAutoCompletePlaces'
import { updatePage } from '../../data-access/actions/updatePage'
import { useSearchParams } from 'next/navigation'


const SearchForm = ({ propertytypes, api_key, classname }: { propertytypes: any; api_key:string; classname?:string }) => {
   
    const searchParams=useSearchParams()

    return (
        <>

            <Form action={'/properties'} className={classname ?? ""}>


                


                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none  font-medium   '  style={{ fontFamily: "Georgia, serif" }}>Select House type</label>
                    {/* <Select name='propertytype_name' defaultValue={searchParams.get("propertytype_name") ?? ""} >
                        <SelectTrigger className="w-full border-primary"  style={{ fontFamily: "Georgia, serif" }}>
                            <SelectValue placeholder="House type" className='text-secondary'  style={{ fontFamily: "Georgia, serif" }} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>House type</SelectLabel>
                                <SelectItem value="test">-----</SelectItem>
                                {propertytypes[0] == 200 && propertytypes[1]?.results?.map((propetytype: { name: string; id: number }, idx: number) => (
                                    <SelectItem value={propetytype.name} key={idx}>{propetytype.name}</SelectItem>

                                ))}

                            </SelectGroup>
                        </SelectContent>
                    </Select> */}


<select 
    name="propertytype_name" 
    defaultValue={searchParams.get("propertytype_name") ?? ""} 
    className="w-full border border-primary p-2 rounded-md"
    style={{ fontFamily: "Georgia, serif" }}
>
    <option value="">House type</option>
    
    {propertytypes[0] == 200 && propertytypes[1]?.results?.map((propertytype: { name: string; id: number }, idx: number) => (
        <option value={propertytype.name} key={idx}>{propertytype.name}</option>
    ))}
</select>


                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none  font-medium   ' style={{ fontFamily: "Georgia, serif" }}>Enter Location</label>
                    <PlacesAutocomplete GOOGLE_MAPS_API_KEY={api_key}  />
                </div>


                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none font-medium   '  style={{ fontFamily: "Georgia, serif" }}>Max Rent Budget</label>
                    <Input name='rent_price_max' defaultValue={searchParams.get("rent_price_max") ?? ""} className='relative p-2 focus:border-secondary border-primary placeholder:text-sm' type='number'  style={{ fontFamily: "Georgia, serif" }} placeholder='eg; 10,000' />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="" className='cursor-none font-medium   '  style={{ fontFamily: "Georgia, serif" }}>Special Condition</label>
                    <Input name='special_condition' defaultValue={searchParams.get("special_condition") ?? ""} className='relative p-2 focus:border-secondary border-primary placeholder:text-sm'  style={{ fontFamily: "Georgia, serif" }} type='text' placeholder='eg; With balcony' />
                </div>

              

                <div>
                    <Button className='mt-4 md:mt-8 px-4 w-full' type='submit'  style={{ fontFamily: "Georgia, serif" }}>Find House</Button>
                </div>


            </Form>
        </>
    )
}

export default SearchForm





