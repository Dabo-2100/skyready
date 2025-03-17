import NoImg from '@/assets/offline.png'
export default function NoData() {
    return (
        <div className='col-12 d-flex flex-column align-items-center justify-content-center'>
            <img height={100} src={NoImg} />
            <p className='text-white text-center'>There are no data ...</p>
        </div>
    )
}
