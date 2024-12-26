import NoImg from '@/assets/offline.png'
import PropTypes from 'prop-types';
export default function NoData(props) {
    return (
        <div className='col-12 d-flex flex-column align-items-center justify-content-center'>
            <img height={100} src={NoImg} />
            <p className=' text-center'>{props.text}</p>
        </div>
    )
}

NoData.propTypes = {
    text: PropTypes.string.isRequired,
};