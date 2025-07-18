import Link from 'next/link'
import { Suspense } from 'react'


export default function NotFound() {
    return (
        <Suspense>
            <div>
                <h2>Not Found</h2>
                <p>Could not find requested the resource</p>
                <Link href="/">Return Home</Link>
            </div>
        </Suspense>
    )
}
