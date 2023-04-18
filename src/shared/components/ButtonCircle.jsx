import { FiLoader } from 'react-icons/fi'
import React from 'react'

export const ButtonCircle = ({type, onClick, loading = false, size = 15}) => {
  return (
    <button className={`button-circle ${type}`} onClick={onClick} disabled={loading}>
      {loading ? (
        <div className="pokeball">
          <div className="pokeball__button"></div>
          <div className="pokeball__spin"></div>
        </div>
      ) : (
        <FiLoader size={size} className="button-circle__icon" />
      )}
    </button>
  )
}
