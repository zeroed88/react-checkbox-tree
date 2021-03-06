import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import TreeNode from '../src/js/TreeNode';

const baseProps = {
	checked: 0,
	expanded: false,
	label: 'Jupiter',
	optimisticToggle: true,
	treeId: 'id',
	value: 'jupiter',
	onCheck: () => {},
	onExpand: () => {},
};

describe('<TreeNode />', () => {
	describe('component', () => {
		it('should render the rct-node container', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} />,
			);

			assert.isTrue(wrapper.find('.rct-node').exists());
		});

		it('should render a label associated with a checkbox', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} treeId="planets" value="jupiter" />,
			);

			assert.equal('planets-jupiter', wrapper.find('label').prop('htmlFor'));
			assert.equal('planets-jupiter', wrapper.find('label input[type="checkbox"]').prop('id'));
		});
	});

	describe('checked', () => {
		it('should render icons associated with each check state', () => {
			const iconMap = {
				0: <span className="rct-icon rct-icon-uncheck" />,
				1: <span className="rct-icon rct-icon-check" />,
				2: <span className="rct-icon rct-icon-half-check" />,
			};

			Object.keys(iconMap).forEach((state) => {
				const wrapper = shallow(
					<TreeNode {...baseProps} checked={parseInt(state, 10)} />,
				);

				assert.isTrue(wrapper.contains(iconMap[state]));
			});
		});

		it('should render an unchecked input element when not set to 1', () => {
			const wrapper1 = shallow(
				<TreeNode {...baseProps} checked={0} />,
			);
			const wrapper2 = shallow(
				<TreeNode {...baseProps} checked={2} />,
			);

			assert.isFalse(wrapper1.find('input[type="checkbox"]').prop('checked'));
			assert.isFalse(wrapper2.find('input[type="checkbox"]').prop('checked'));
		});

		it('should render a checked input element when set to 1', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} checked={1} />,
			);

			assert.isTrue(wrapper.find('input[type="checkbox"]').prop('checked'));
		});
	});

	describe('expanded', () => {
		it('should render children when set to true', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} expanded rawChildren={[{ value: 'europa', label: 'Europa' }]}>
					<TreeNode {...baseProps} label="Europa" value="europa" />
				</TreeNode>,
			);

			assert.equal('europa', wrapper.find(TreeNode).prop('value'));
		});

		it('should not render children when set to false', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} expanded={false} rawChildren={[{ value: 'europa', label: 'Europa' }]}>
					<TreeNode {...baseProps} />
				</TreeNode>,
			);

			assert.isFalse(wrapper.find(TreeNode).exists());
		});

		it('should render expanded icons when set to true', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} expanded rawChildren={[{ value: 'europa', label: 'Europa' }]} />,
			);

			assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-expand-open" />));
			assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-parent-open" />));
		});

		it('should render collapsed icons when set to false', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} expanded={false} rawChildren={[{ value: 'europa', label: 'Europa' }]} />,
			);

			assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-expand-close" />));
			assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-parent-close" />));
		});
	});

	describe('icon', () => {
		it('should replace the node\'s icons with the supplied value', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} icon={<span className="fa fa-plus" />} />,
			);

			assert.isTrue(wrapper.contains(
				<span className="rct-node-icon">
					<span className="fa fa-plus" />
				</span>,
			));
		});
	});

	describe('label', () => {
		it('should render the node\'s label', () => {
			const wrapper = shallow(
				<TreeNode {...baseProps} label="Europa" value="europa" />,
			);

			assert.isTrue(wrapper.contains(
				<span className="rct-title">Europa</span>,
			));
		});
	});

	describe('onCheck', () => {
		it('should pass the current node\'s value', () => {
			let actual = {};

			const wrapper = shallow(
				<TreeNode
					{...baseProps}
					value="jupiter"
					onCheck={(node) => {
						actual = node;
					}}
				/>,
			);

			wrapper.find('input[type="checkbox"]').simulate('change');

			assert.equal('jupiter', actual.value);
		});

		it('should toggle an unchecked node to checked', () => {
			let actual = {};

			const wrapper = shallow(
				<TreeNode
					{...baseProps}
					checked={0}
					value="jupiter"
					onCheck={(node) => {
						actual = node;
					}}
				/>,
			);

			wrapper.find('input[type="checkbox"]').simulate('change');

			assert.isTrue(actual.checked);
		});

		it('should toggle a checked node to unchecked', () => {
			let actual = {};

			const wrapper = shallow(
				<TreeNode
					{...baseProps}
					checked={1}
					value="jupiter"
					onCheck={(node) => {
						actual = node;
					}}
				/>,
			);

			wrapper.find('input[type="checkbox"]').simulate('change');

			assert.isFalse(actual.checked);
		});

		it('should toggle a partially-checked node to checked', () => {
			let actual = {};

			const wrapper = shallow(
				<TreeNode
					{...baseProps}
					checked={2}
					value="jupiter"
					onCheck={(node) => {
						actual = node;
					}}
				/>,
			);

			wrapper.find('input[type="checkbox"]').simulate('change');

			assert.isTrue(actual.checked);
		});

		describe('optimisticToggle', () => {
			it('should toggle a partially-checked node to unchecked', () => {
				let actual = {};

				const wrapper = shallow(
					<TreeNode
						{...baseProps}
						checked={2}
						optimisticToggle={false}
						value="jupiter"
						onCheck={(node) => {
							actual = node;
						}}
					/>,
				);

				wrapper.find('input[type="checkbox"]').simulate('change');

				assert.isFalse(actual.checked);
			});
		});
	});

	describe('onExpand', () => {
		it('should negate the expanded property and pass the current node\'s value', () => {
			let actual = {};

			const wrapper = shallow(
				<TreeNode
					{...baseProps}
					expanded
					rawChildren={[{ value: 'europa', label: 'Europa' }]}
					value="jupiter"
					onExpand={(node) => {
						actual = node;
					}}
				/>,
			);

			wrapper.find('.rct-collapse').simulate('click');

			assert.deepEqual({ value: 'jupiter', expanded: false }, actual);
		});
	});
});
