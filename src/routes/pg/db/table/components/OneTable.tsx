interface OneTableProps {
table_name: string
}

export function OneTable({table_name}:OneTableProps){
return (
 <div className='w-full h-full flex items-center justify-center'>
{table_name}
 </div>
);
}
