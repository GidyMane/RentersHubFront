import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1C4532]">Renters Hub</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-[#1C4532] hover:bg-[#1C4532]/90">Sign Up</Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="House Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bedsitter">Bedsitter</SelectItem>
              <SelectItem value="1bedroom">One Bedroom</SelectItem>
              <SelectItem value="2bedroom">Two Bedroom</SelectItem>
              <SelectItem value="3bedroom">Three Bedroom</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Rent Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-15000">Ksh 0 - 15,000</SelectItem>
              <SelectItem value="15000-30000">Ksh 15,000 - 30,000</SelectItem>
              <SelectItem value="30000-50000">Ksh 30,000 - 50,000</SelectItem>
              <SelectItem value="50000+">Ksh 50,000+</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#1C4532] hover:bg-[#1C4532]/90">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </header>
  )
}

