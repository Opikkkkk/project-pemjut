import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className=" bg-gradient-to-r from-blue-100 to-gray-900">
            {children}
        </div>
    );
}
