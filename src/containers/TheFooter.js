import React from 'react'
import { CFooter, CLink } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <span className="mr-1">Contact:</span>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord & Telegram Links</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
