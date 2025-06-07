import { Link } from 'react-router';
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Orbit" },
        { name: "description", content: "Welcome to Orbit!" },
    ];
}


const HomePage = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center gap-4">
            <Link to="/sign-in">
                <Button className='bg-blue-500 text-white'>Sign In</Button>
            </Link>
            <Link to="/sign-up">
                <Button variant="secondary" className='bg-blue-500 text-white'>Sign Up</Button>
            </Link>
        </div>
    )
}

export default HomePage