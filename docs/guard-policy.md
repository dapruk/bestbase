# Guard Policy

Bestbase memakai guardap `1.2.0` sebagai authorization engine. Layer
`core/guard` hanya membuat instance guardap dan adapter route TanStack yang
memanggil metadata evaluator dari guardap. Tidak ada permission parser, fallback
`can`, atau authorization engine buatan basecode.
