import React from 'react'
import { postsByDate } from '../data/gsocPosts'
import Region from './Region'
import BindingDiff from './BindingDiff'

export default function GSoC() {
    return (
        <Region id="gsoc" perm="r--" tone="yellow">
            <h2 className="giant">gsoc '26</h2>

            <div className="gsoc-intro">
            <div className="prose">
                <p>
                    I was a Google Summer of Code '26 contributor with The Linux Foundation,
                    working directly in the mainline Linux kernel tree. My project was
                    converting the kernel's devicetree bindings from the old free-form{' '}
                    <code>.txt</code> format into validated YAML schemas (the machine-checkable
                    contracts that describe how hardware is wired up on a board).
                </p>
                <p>
                    In practice that meant writing the YAML schema, updating the{' '}
                    <code>.dts</code> device tree sources that reference each binding, and reading
                    through the relevant driver code to make sure the schema actually matched
                    what the driver expects. Every patch went through the standard upstream
                    review process on the kernel mailing lists: real maintainers, real review,
                    merged into the tree everyone runs.
                </p>
            </div>
            <BindingDiff />
            </div>

            <a className="more" href="#/blog">
                <span className="more-title">the log</span>
                <span className="more-meta">{postsByDate.length} entries -&gt;</span>
            </a>
        </Region>
    )
}
