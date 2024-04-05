import { Routes, Route, Navigate } from 'react-router-dom'

import { Rules } from './pages'
import { CoreLayout } from './layout'

export function Router() {
  return (
    <CoreLayout>
      <Routes>
        <Route path="/settings">
          <Route path="mail">
            <Route path="rules" element={<Rules />} />
            <Route index element={<Navigate to="rules" />} />
          </Route>
          <Route index element={<Navigate to="mail" />} />
        </Route>
        <Route index element={<Navigate to="/settings" />} />
      </Routes>
    </CoreLayout>
  )
}
